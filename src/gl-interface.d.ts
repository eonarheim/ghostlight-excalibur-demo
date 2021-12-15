interface IScene {
  config: IConfig
  actors: IActor[]
}

interface IConfig {
  background: string
  width: number
  height: number
}

interface IActor {
  id: string
  type_id: string
  type?: string
  texture?: string
  x: number
  y: number
  width: number
  height: number
  props: Object
}

interface IType {
  id: string
  name: string
  texture: string
  props: {
    id: string
    name: string,
    default: any,
  }[]
}

type TResizeOption = "Disabled" | "Scale" | "Repeat" | "Sliced"
