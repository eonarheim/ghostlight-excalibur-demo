export function parse(sceneJson: string, typesJson: string) {
  const scene: glScene = JSON.parse(sceneJson)
  const types: glType[] = JSON.parse(typesJson)
  for (const actor of scene.actors) {
    // denormalize
    const type = types.find(x => x.id === actor.type_id)
    if (!type) throw (`ghostlight: type not found for actor with id: ${actor.id}`)
    actor.type = type.name
    actor.texture = type.texture
    actor.resize = type.resize
    type.props.forEach(p => {
      actor.props[p.name] = actor.props[p.id] ?? p.default
      delete actor.props[p.id]
    })
  }
  return scene
}
