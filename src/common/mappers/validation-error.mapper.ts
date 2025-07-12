import { ValidationError } from 'class-validator';

// TECHDEBT: masih belum optimal, jadi belum dipake
export interface ValidationErrorItem {
  field: string;
  message: string;
  value?: any;
}

export type ValidationErrorDetails = Array<ValidationErrorItem>;

export class ValidationErrorMapper {
  static mapValidationErrors(errors: ValidationError[]): {
    details: ValidationErrorDetails;
  } {
    const validationDetails = this.flattenValidationErrors(errors);

    return {
      details: validationDetails,
    };
  }

  private static flattenValidationErrors(
    errors: ValidationError[],
    parentField = '',
  ): ValidationErrorDetails {
    const result: ValidationErrorDetails = [];

    for (const error of errors) {
      const fieldName = parentField
        ? `${parentField}.${error.property}`
        : error.property;

      if (error.constraints) {
        // Handle simple validation errors
        const messages = Object.values(error.constraints);

        result.push({
          field: fieldName,
          message: messages[0], // Take first message
          value: error.value,
        });
      }

      if (error.children && error.children.length > 0) {
        // Handle nested validation errors
        const nestedErrors = this.flattenValidationErrors(
          error.children,
          fieldName,
        );
        result.push(...nestedErrors);
      }
    }

    return result;
  }
}
