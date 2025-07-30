


interface colorType {
    id: number;
    name: string;
    hex_code: string;
}

interface pictureType {
    id: number;
    file: string;
    name: string;
    created_at: string;
    updated_at: string;
}

export interface modelMobileType {
    id: number;
    model_name: string;
    brand: string;
    colors: colorType[];
    pictures: pictureType[];
    is_apple: boolean;
    part_number: string;
    link: string;
    created_at: string;
    updated_at: string;
}

