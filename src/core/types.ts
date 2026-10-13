export interface Region {
    id: string;
    name: string;
    path: string;
}

export interface CustomStyleType {
  idleColor: string;
  hoverColor: string;
}

export interface ViewBox {
    top: number;
    left: number;
    width: number;
    height: number;
}

export interface Country {
    id: string;
    name: string;
    viewBox: ViewBox;
    regions: Region[];
}