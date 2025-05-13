import React, { useEffect, useState, useRef } from "react";

import style from "./UserDelete.module.css";

const UserDelete = async () => {
  return (
    <section className={style.areYouSureSection}>
      <div className={style.innerDiv}></div>
    </section>
  );
};

export default UserDelete;
