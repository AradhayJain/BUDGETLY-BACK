import bcrypt from "bcryptjs";
const password = "aradhay@2006";
const hash = "$2b$10$.JYJ4zi9MzHKbPXqxHJSV.YXGLG.nyKejm/hX5CmZRnroSBl1rFNW";

bcrypt.compare(password, hash).then(console.log); // Should return true or false
