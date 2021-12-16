interface glScene {
  config: glConfig
  actors: glActor[]
}

interface glConfig {
  background: string
  width: number
  height: number
}

interface glActor {
  id: string
  type_id: string
  type: string
  texture: string
  resize: glResizeOption
  x: number
  y: number
  width: number
  height: number
  props: { [key: string]: any }
}

interface glType {
  id: string
  name: string
  texture: string
  resize: glResizeOption
  props: {
    id: string
    name: string,
    default: any,
  }[]
}

type glResizeOption = "Disable" | "Scale" | "Repeat" | "Slice"
