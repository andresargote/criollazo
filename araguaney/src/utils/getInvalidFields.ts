type Field = {
    name: string;
    type: string;
    value: string | number | undefined;
    required: boolean;
}

const isValidString = (value: string) => {
    return typeof value === 'string' && value.trim().length > 0;
}

const isValidNumber = (value: number) => {
    return !isNaN(value) && value >= 0;
}


const isRequired = (field: Field, body: any) => {
    return field.required && body[field.name] === undefined;
}


export const getInvalidFields = (fields: Field[], body: any) => {
    const invalidFields: string[] = [];


    for (const field of fields) {

        if (field.type === "string" && !isValidString(field.value as string) || isRequired(field, body)) {
            invalidFields.push(field.name);
        }

        if (field.type === "number" && !isValidNumber(field.value as number) || isRequired(field, body)) {
            invalidFields.push(field.name);
        }
    }



    return invalidFields

}