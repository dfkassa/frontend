use wasm_bindgen::prelude::*;

pub mod output;
pub mod error;


#[wasm_bindgen]
pub async fn launch_app(query: String) -> Result<output::LaunchOutput, JsError> {
    // Err(error::DFKassaLaunchError::Unknown.into())
    Ok(output::LaunchOutput::new(
        "3.45".to_owned(),
        output::OutputCurrency {
            label: "USD".to_owned(),
            symbol: "$".to_owned()
        },
        "https://t.me/durov".to_owned(),
        "123123".to_owned(),
        vec![
            output::OutputNetwork {
                id: "ETH1".to_owned(),
                name: "Ethereum Mainnet".to_owned(),
                reciever: "0x123".to_owned()
            },
            output::OutputNetwork {
                id: "ETH5".to_owned(),
                name: "Ethereum Goerli Testnet".to_owned(),
                reciever: "0x123".to_owned()
            },
            output::OutputNetwork {
                id: "ETH97".to_owned(),
                name: "Binance Smart Chain Testnet".to_owned(),
                reciever: "0x123".to_owned()
            }
        ],
        vec![
            output::OutputToken {
                symbol: "BUSD".to_owned(),
                amount: output::OuputTokenAmount {
                    human_format: "3.42".to_owned(),
                    contract_format: "3420000000000000000".to_owned()
                },
                address: "0x123".to_owned(),
                decimals: 18,
                name: "Binance USD".to_owned(),
                network_id: "ETH1".to_owned()
            }
        ]
    ))
}
