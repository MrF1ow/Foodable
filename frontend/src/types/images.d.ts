import type { CollectionNames } from "."

export interface NewImageData {
    image: File,
    sourceId: string,
    collectionName: CollectionNames
}

export interface ExistingImageData {
    imageId: string,
    collectionName: CollectionNames
}


export type UploadImageResponse = {
    _id: string,
    message: string
}

export type DeleteImageReponse = {
    message: string
}