/**@format */

export const generateDisplayNameOptions = (salut: string, fname: string, lname: string) => {
  const names: { label: string; id: number }[] = [];
  let index = 0;

  if (salut && !fname && !lname) {
    names.push({ label: `${salut}`, id: index++ });
  }

  if (salut && fname && lname) {
    names.push(
      { label: `${salut} ${fname} ${lname}`, id: index++ },
      { label: `${fname} ${lname}`, id: index++ },
      { label: `${lname}, ${fname}`, id: index++ }
    );
  } else if (salut && fname) {
    names.push({ label: `${salut} ${fname}`, id: index++ }, { label: `${fname}`, id: index++ });
  } else if (!salut && fname && lname) {
    names.push(
      { label: `${fname} ${lname}`, id: index++ },
      { label: `${lname}, ${fname}`, id: index++ }
    );
  } else if (!salut && !fname && lname) {
    names.push({ label: `${lname}`, id: index++ });
  } else if (!salut && !lname && fname) {
    names.push({ label: `${fname}`, id: index++ });
  } else if (salut && !fname && lname) {
    names.push({ label: `${salut} ${lname}`, id: index++ });
  } else if (salut && !lname && fname) {
    names.push({ label: `${salut} ${fname}`, id: index++ });
  }

  return names;
};

// export const generateDisplayNameOptions = (salut: string, fname: string, lname: string) => {
//   const names: { label: string; id: string; index: number }[] = [];
//   let index = 0;

//   if (salut && !fname && !lname) {
//     names.push({ label: `${salut}`, id: `${salut}`, index: index++ });
//   }

//   if (salut && fname && lname) {
//     names.push(
//       { label: `${lname}, ${fname}`, id: `${lname}, ${fname}`, index: index++ },
//       { label: `${fname} ${lname}`, id: `${fname} ${lname}`, index: index++ },
//       { label: `${salut} ${fname} ${lname}`, id: `${salut} ${fname} ${lname}`, index: index++ }
//     );
//   } else if (salut && fname) {
//     names.push(
//       { label: `${salut} ${fname}`, id: `${salut} ${fname}`, index: index++ },
//       { label: `${fname}`, id: `${fname}`, index: index++ }
//     );
//   } else if (!salut && fname && lname) {
//     names.push(
//       { label: `${fname} ${lname}`, id: `${fname} ${lname}`, index: index++ },
//       { label: `${lname}, ${fname}`, id: `${lname}, ${fname}`, index: index++ }
//     );
//   } else if (!salut && !fname && lname) {
//     names.push({ label: `${lname}`, id: `${lname}`, index: index++ });
//   } else if (!salut && !lname && fname) {
//     names.push({ label: `${fname}`, id: `${fname}`, index: index++ });
//   } else if (salut && !fname && lname) {
//     names.push({ label: `${salut} ${lname}`, id: `${salut} ${lname}`, index: index++ });
//   } else if (salut && !lname && fname) {
//     names.push({ label: `${salut} ${fname}`, id: `${salut} ${fname}`, index: index++ });
//   }

//   return names;
// };

// export const generateDisplayNameOptions = (
//   salut: string,
//   fname: string,
//   lname: string
// ) => {
//   const names: string[] = [];
//   if (salut && !fname && !lname) names.push(`${salut}`);
//   if (salut && fname && lname)
//     names.push(
//       `${lname}, ${fname}`,
//       `${fname} ${lname}`,
//       `${salut} ${fname} ${lname}`
//     );
//   else if(salut && fname)
//     names.push(
//       `${salut} ${fname}`,
//       `${fname}`
//     );
//   else if (!salut && fname && lname)
//     names.push(`${fname} ${lname}`, `${lname}, ${fname}`);
//   else if (!salut && !fname && lname) names.push(`${lname}`);
//   else if (!salut && !lname && fname) names.push(`${fname}`);
//   else if (salut && !fname && lname) names.push(`${salut} ${lname}`);
//   else if (salut && !lname && fname) names.push(`${salut} ${fname}`);
//   return names;
// };
