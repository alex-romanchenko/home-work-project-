import Ajv from "ajv";
import type { NewsPostCreateData, NewsPostUpdateData } from "../types/NewsPost";
import { ValidationError } from "../errors/ValidationError";

const ajv = new Ajv();

const createSchema = {
    type: "object",
    properties: {
        title: { type: "string", maxLength: 50 },
        text: { type: "string", maxLength: 256 },
        genre: { type: "string", enum: ["Politic", "Business", "Sport", "Other"] },
        isPrivate: { type: "boolean" },
    },
    required: ["title", "text", "genre", "isPrivate"],
    additionalProperties: false,
};

const updateSchema = {
    type: "object",
    properties: {
        title: { type: "string", maxLength: 50 },
        text: { type: "string", maxLength: 256 },
        genre: { type: "string", enum: ["Politic", "Business", "Sport", "Other"] },
        isPrivate: { type: "boolean" },
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