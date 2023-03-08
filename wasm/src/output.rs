use wasm_bindgen::prelude::*;


#[wasm_bindgen(getter_with_clone)]
#[derive(Clone, Debug)]
pub struct OutputCurrency {
    pub label: String,
    pub symbol: String
}


#[wasm_bindgen(getter_with_clone)]
#[derive(Clone, Debug)]
pub struct OutputNetwork {
    pub id: String,
    pub name: String,
    pub reciever: String
}


#[wasm_bindgen(getter_with_clone)]
#[derive(Clone, Debug)]
pub struct OuputTokenAmount {
    pub human_format: String,
    pub contract_format: String
}


#[wasm_bindgen(getter_with_clone)]
#[derive(Clone, Debug)]
pub struct OutputToken {
    pub symbol: String,
    pub amount: OuputTokenAmount,
    pub address: String,
    pub decimals: usize,
    pub name: String,
    pub network_id: String,
}


#[derive(Clone, Debug)]
#[wasm_bindgen(getter_with_clone)]
pub struct LaunchOutput {
    amount: String,
    currency: OutputCurrency,
    contact: String,
    payload: String,
    networks: Vec<OutputNetwork>,
    tokens: Vec<OutputToken>
}

impl LaunchOutput {
    pub fn new(
        amount: String,
        currency: OutputCurrency,
        contact: String,
        payload: String,
        networks: Vec<OutputNetwork>,
        tokens: Vec<OutputToken>
    ) -> Self {
        LaunchOutput { amount, currency, contact, payload, networks, tokens }
    }
}


#[wasm_bindgen]
extern "C" {
    #[wasm_bindgen(typescript_type = "Array<OutputNetwork>")]
    pub type OutputNetworkArray;

    #[wasm_bindgen(typescript_type = "Array<OutputToken>")]
    pub type OutputTokenArray;
}


#[wasm_bindgen]
impl LaunchOutput {
    #[wasm_bindgen(getter)]
    pub fn amount(&self) -> String {
        self.amount.clone()
    }

    #[wasm_bindgen(getter)]
    pub fn currency(&self) -> OutputCurrency {
        self.currency.clone()
    }

    #[wasm_bindgen(getter)]
    pub fn contact(&self) -> String {
        self.contact.clone()
    }

    #[wasm_bindgen(getter)]
    pub fn payload(&self) -> String {
        self.payload.clone()
    }

    #[wasm_bindgen(getter)]
    pub fn networks(&self) -> OutputNetworkArray {
        let array = js_sys::Array::new();
        for network in &self.networks {
            array.push(&JsValue::from(network.clone()));
        }
        array.unchecked_into::<OutputNetworkArray>()
    }

    #[wasm_bindgen(getter)]
    pub fn tokens(&self) -> OutputTokenArray {
        let array = js_sys::Array::new();
        for token in &self.tokens {
            array.push(&JsValue::from(token.clone()));
        }
        array.unchecked_into::<OutputTokenArray>()
    }

}
