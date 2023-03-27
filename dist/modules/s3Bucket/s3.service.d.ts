/// <reference types="node" />
export declare class S3ImageUpload {
    constructor();
    private s3;
    upload(data: any): Promise<any>;
    getUploadedFile(id: any): Promise<import("stream").Readable>;
}
