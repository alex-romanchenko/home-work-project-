import Ajv from "ajv";
import type { NewsPostCreateData, NewsPostUpdateData } from "../types/NewsPost";
import { ValidationError } from "../errors/ValidationError";

const ajv = new Ajv();

const createSchema = {
    type: "object",
    properties: {
        header: { type: "string", maxLength: 50 },
        text: { type: "string", maxLength: 256 },
    },
    required: ["header", "text"],
    additionalProperties: false,
};

const updateSchema = {
    type: "object",
    properties: {
        header: { type: "string", maxLength: 50 },
        text: { type: "string", maxLength: 256 },
    },
    additionalProperties: false,
};

const validateCreate = ajv.compile(createSchema);
const validateUpdate = ajv.compile(updateSchema);

export const validateNewspostCreate = (data: NewsPostCreateData): void => {
    const valid = validateCreate(data);

    if (!valid) {
        const details = (validateCreate.errors ?? []).map(
            (error) => `${error.instancePath || "field"} ${error.message ?? ""}`
        );

        throw new ValidationError("Invalid newspost create data", details);
    }
};

export const validateNewspostUpdate = (data: NewsPostUpdateData): void => {
    const valid = validateUpdate(data);

    if (!valid) {
        const details = (validateUpdate.errors ?? []).map(
            (error) => `${error.instancePath || "field"} ${error.message ?? ""}`
        );

        throw new ValidationError("Invalid newspost update data", details);
    }
};