import Float "mo:base/Float";
import Text "mo:base/Text";
import Error "mo:base/Error";

actor Calculator {
  public func calculate(operation: Text, a: Float, b: Float) : async ?Float {
    switch (operation) {
      case ("add") { ?(a + b) };
      case ("subtract") { ?(a - b) };
      case ("multiply") { ?(a * b) };
      case ("divide") {
        if (b == 0) {
          null // Return null for division by zero
        } else {
          ?(a / b)
        }
      };
      case (_) {
        throw Error.reject("Invalid operation");
      };
    }
  };
}
