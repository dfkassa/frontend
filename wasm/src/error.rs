use thiserror::Error;

#[derive(Error, Debug)]
pub enum DFKassaLaunchError {
    #[error("test error")]
    Unknown,
}
