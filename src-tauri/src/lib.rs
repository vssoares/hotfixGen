use std::fs;
use std::io::Read;
use std::path::PathBuf;
use std::process::{Command, Stdio};
use tauri::{AppHandle, Emitter};

const HF_SCRIPT: &str = include_str!("../../hf.ps1");

fn ensure_script() -> Result<PathBuf, std::io::Error> {
    let path = std::env::temp_dir().join("hf_projectmanager.ps1");
    fs::write(&path, HF_SCRIPT)?;
    Ok(path)
}

#[tauri::command]
async fn run_command(
    app: AppHandle,
    action: String,
    version: Option<String>,
    project_path: String,
    branch_type: Option<String>,
    branch_us: Option<String>,
    branch_name: Option<String>,
) -> Result<(), String> {
    let script_path = ensure_script().map_err(|e| e.to_string())?;

    let mut args = vec![
        "-ExecutionPolicy".to_string(),
        "Bypass".to_string(),
        "-NonInteractive".to_string(),
        "-File".to_string(),
        script_path.to_str().unwrap().to_string(),
        "-action".to_string(),
        action,
    ];

    if let Some(v) = version {
        if !v.is_empty() {
            args.push("-version".to_string());
            args.push(v);
        }
    }
    if let Some(bt) = branch_type {
        if !bt.is_empty() {
            args.push("-branchType".to_string());
            args.push(bt);
        }
    }
    if let Some(bu) = branch_us {
        if !bu.is_empty() {
            args.push("-branchUs".to_string());
            args.push(bu);
        }
    }
    if let Some(bn) = branch_name {
        if !bn.is_empty() {
            args.push("-branchName".to_string());
            args.push(bn);
        }
    }

    let app_clone = app.clone();

    tauri::async_runtime::spawn_blocking(move || -> Result<(), String> {
        let mut child = Command::new("powershell.exe")
            .args(&args)
            .current_dir(&project_path)
            .stdout(Stdio::piped())
            .stderr(Stdio::piped())
            .spawn()
            .map_err(|e| e.to_string())?;

        let mut stdout = child.stdout.take().unwrap();
        let mut stderr = child.stderr.take().unwrap();

        let app1 = app_clone.clone();
        let t1 = std::thread::spawn(move || {
            let mut buf = vec![0u8; 4096];
            loop {
                match stdout.read(&mut buf) {
                    Ok(0) => break,
                    Ok(n) => {
                        let text = String::from_utf8_lossy(&buf[..n]).to_string();
                        let _ = app1.emit("ps:out", text);
                    }
                    Err(_) => break,
                }
            }
        });

        let app2 = app_clone.clone();
        let t2 = std::thread::spawn(move || {
            let mut buf = vec![0u8; 4096];
            loop {
                match stderr.read(&mut buf) {
                    Ok(0) => break,
                    Ok(n) => {
                        let text = String::from_utf8_lossy(&buf[..n]).to_string();
                        let _ = app2.emit("ps:err", text);
                    }
                    Err(_) => break,
                }
            }
        });

        t1.join().ok();
        t2.join().ok();

        let status = child.wait().map_err(|e| e.to_string())?;
        let code = status.code().unwrap_or(-1);
        let _ = app_clone.emit("ps:done", code);

        Ok(())
    })
    .await
    .map_err(|e| e.to_string())?
}

#[tauri::command]
async fn open_gitk(project_path: String) -> Result<(), String> {
    Command::new("git")
        .args(["fetch", "--all"])
        .current_dir(&project_path)
        .output()
        .map_err(|e| e.to_string())?;

    Command::new("gitk")
        .arg("master")
        .current_dir(&project_path)
        .spawn()
        .map_err(|e| e.to_string())?;

    Ok(())
}

#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
    tauri::Builder::default()
        .plugin(tauri_plugin_dialog::init())
        .plugin(tauri_plugin_updater::Builder::new().build())
        .plugin(tauri_plugin_process::init())
        .invoke_handler(tauri::generate_handler![run_command, open_gitk])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
