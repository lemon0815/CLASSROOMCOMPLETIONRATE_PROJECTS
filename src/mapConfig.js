const changeVK = new Map([
  ['changeVK.switch', '切课方案总开关'],
  ['changeVK.effective.days', '生效星期'],
  ['changeVK.active.time.range', '生效时间'],
  ['changeVK.msgPipeline.threshold', '信令阈值'],
  ['changeVK.capacity.threshold', '各线路并发阈值'],
]);
const roomType = new Map([
  ['room.type.vop.switch', 'VOP总开关'],
  ['room.type.vop.teacher.effective.days', '生效星期'],
  ['room.type.vop.teacher.active.time.range', '生效时间'],
  ['room.type.vop.teacher.chrome.lowest', '最低支持VOP的Chrome版本'],
  ['room.type.vop.teacher.disable.lines', 'VOP禁用线路'],
]);

export { changeVK, roomType };
