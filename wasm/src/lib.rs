use wasm_bindgen::prelude::*;

use crate::output::Foo;


pub mod output;

#[wasm_bindgen]
pub fn add(x: i32, y: i32) -> Foo {
    Foo::new(x + y)
}
