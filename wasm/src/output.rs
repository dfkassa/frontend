use wasm_bindgen::prelude::*;

#[wasm_bindgen]
pub struct Foo {
    pub field: i32,
    pub internal: i32
}

#[wasm_bindgen]
impl Foo {
    #[wasm_bindgen(constructor)]
    pub fn new(field: i32) -> Foo {
        Foo { field, internal: 123 }
    }
}


#[wasm_bindgen(getter_with_clone)]
#[derive(Clone, Debug)]
pub struct Currency {
    label: String,
    symbol: String
}


#[wasm_bindgen(getter_with_clone)]
#[derive(Clone, Debug)]
pub struct Reciever {
    pub eth: Option<String>,
    pub tron: Option<String>
}


#[wasm_bindgen(getter_with_clone)]
#[derive(Clone, Debug)]
pub struct Network {
    pub id: String,
    pub name: String,
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
    pub decimals: usize,
    pub name: String,
    pub network_id: String,
}


#[wasm_bindgen(getter_with_clone)]
pub struct LaunchOutput {
    amount: String,
    currency: Currency,
    reciever: Reciever,
    contact: String,
    payload: String,
    networks: Vec<Network>,
    tokens: Vec<OutputToken>
}
