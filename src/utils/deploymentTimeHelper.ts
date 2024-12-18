//@ts-nocheck
export const setDeploymentTime = (data) => {
  if (data.force_logout !== false) {
    setTimeout(function () {
      localStorage.setItem("force_logout", true);
    }, 2000);
  }
  let storeDate = JSON.parse(localStorage.getItem("deploymentTime"));
  // console.log("storeDate ----------", storeDate);
  if (storeDate !== null) {
    storeDate = new Date(storeDate);
    let newDate = data.deploymentTime.created_at;
    newDate = new Date(newDate);
    // console.log("newDate", newDate, " --------- storeDate", storeDate);
    if (newDate.getTime() > storeDate.getTime()) {
      localStorage.removeItem("deploymentTime");
      if (caches) {
        caches.keys().then((names) => {
          names.forEach((name) => {
            caches.delete(name);
          });
        });
      }
      localStorage.setItem("deploymentTime", JSON.stringify(data.deploymentTime.created_at));
      window.location.reload(true);
    } else {
      localStorage.setItem("deploymentTime", JSON.stringify(data.deploymentTime.created_at));
    }
  } else {
    localStorage.setItem("deploymentTime", JSON.stringify(data.deploymentTime.created_at));
  }
};
