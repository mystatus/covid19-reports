import moment from 'moment-timezone';

export interface ValidatedExpression {
  isValid: boolean; // is the expression valid and does it yield a value?
  inputValid: boolean; // is the expression input valid and conform to a mimimum standard
  value: string | number;
}

/**
 * This method parses strings for mathematical expressions
 */
export function validateMathematicExpression(exp: string): ValidatedExpression {
  // eslint-disable-next-line
  const regex = new RegExp(/^([-])?(\d+(\.\d+)?(\s)*([-+\/*])?(\s)*(\d+(\.\d+))?)*$/g);
  const validatedExp: ValidatedExpression = {
    isValid: false,
    inputValid: regex.test(exp),
    value: '',
  };

  try {
    if (validatedExp.inputValid) {
      // Disable warning about eval since we use the regex to validate
      // the input as mathematical expression
      // eslint-disable-next-line
      validatedExp.value = eval(exp) as number;
      validatedExp.isValid = true;
    }
  } catch (e) {
    validatedExp.isValid = false;
  }
  return validatedExp;
}

/**
 * This method parses time expressions via momentJS JSON/object notation
 */
export function validateTimeExpression(exp: string): ValidatedExpression {
  const validatedExp: ValidatedExpression = {
    isValid: false,
    // this method does not have any cases where input is invalid
    inputValid: false,
    value: '',
  };
  try {
    if (exp) {
      validatedExp.inputValid = true;
      const jsonExp = JSON.parse(exp);
      validatedExp.value = moment().startOf('day').add(jsonExp).toISOString();
      validatedExp.isValid = true;
    }
  } catch (e) {
    validatedExp.isValid = false;
  }
  return validatedExp;
}
