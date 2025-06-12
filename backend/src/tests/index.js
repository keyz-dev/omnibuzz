const object = {
  images: [
    {
      path: "uploads/agencies/171820250612092028-create-agency.js",
    },
    {
      path: "uploads/agencies/171820250612092028-create-agency.js",
    },
    {
      path: "uploads/agencies/171820250612092028-create-agency.js",
    },
  ],
  logo: [
    {
      path: "uploads/agencies/171820250612092028-create-agency.js",
    },
  ],
};

const items = Object.entries(object).flatMap(([key, value]) =>
  value.map((item) => ({ key, path: item.path }))
);
console.log(items);

// const values = Object.values(object);
// console.log(values);

// const items = Object.values(object).flatMap((item) =>
//   item.map((item) => item.path)
// );
// console.log(items);
// process.exit(0);
