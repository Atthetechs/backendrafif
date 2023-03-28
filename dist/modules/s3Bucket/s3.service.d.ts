/// <reference types="node" />
export declare class S3ImageUpload {
    constructor();
    private s3;
    upload(data: any): Promise<any>;
    singleImageUpload(data: any): Promise<string>;
    getUploadedFile(id: any): Promise<import("stream").Readable>;
}
