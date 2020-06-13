import React from "react";

export default function Icon({ name = "", extention="png", style, onClick, className="" }) {
    let img = require(`../../../../assets/icons/m_icon_${name}.${extention}`)
  return (
    <img onClick={onClick} style={style} className={"icon "+className} src={img} alt={"icon-" + name} />
  );
}
