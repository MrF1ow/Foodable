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