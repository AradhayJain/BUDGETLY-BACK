import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

const userSchema = new mongoose.Schema({
  name: String,
  type:{
    type:String,
    enum:['working professional','student','user'],
    default:"student"
  },
  email: { type: String, unique: true },
  password: String,
  pic:{
    type:String,
    default:"data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wCEAAkGBwgHBgkIBwgKCgkLDRYPDQwMDRsUFRAWIB0iIiAdHx8kKDQsJCYxJx8fLT0tMTU3Ojo6Iys/RD84QzQ5OjcBCgoKDQwNGg8PGjclHyU3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3N//AABEIAJQAngMBIgACEQEDEQH/xAAbAAEAAgMBAQAAAAAAAAAAAAAABAYBAwUHAv/EADoQAAICAQIBBgoIBwAAAAAAAAABAgMEBREGEiExQVFxEyIyYXKBkbHB0TQ1QlJTYnOhFBUjM0Ph8P/EABQBAQAAAAAAAAAAAAAAAAAAAAD/xAAUEQEAAAAAAAAAAAAAAAAAAAAA/9oADAMBAAIRAxEAPwD3EAAAAAAAAAAAY3PiV1cfKsgu+WwGwHxCyE/IlGXc9z7AAAAAAAAAAAAAAAAAAGG9gMnF1LX6sdurGSusXS9/FXzI/EOqyUnh4z81sk/2K6BKydRzMpvw18tvuxeyIgAGU2nvFtPtTOhia1m4zS8J4WH3Z8/7nOAF103VaM9bRfItS54S6fV2nQPPITlXNTrk4yT3TXUXDRNTWfQ42bK+HlpdfnA6YAAAAAAAAAAAAARNVylh4Nt32kto976CWV/iy1qvHq7ZOT9S2+LArcm5Scm923u2+0wAAAAAAACTp+U8PLhcm9k9pLtXWRgB6JGSlFNdDRkgaHY7dLx2+dxjyPZzE8AAAAAAAAAAABWeLU/DY76uS/eWY4fFdDnh13R/xz2fc/8AkBVgAAAAAAAAABcOGk/5VXv1yk17TqkTSqHjafRU14ygt+987JYAAAAAAAAAAADVlUxyMeymfkzjszaAPP8AJosxr502racHszUXLWtLjn1qUPFvgvFfVLzMqFtVlNkq7YOM49KaA+AAABkAYOloeC8zNi5L+lU+VPz9iI+BhXZ1vIoXMn4030RRcsDEqwseNVSe3S2+lvtAkgAAAAAAAAAAAAAAAEXMwMfNgo5EFJrol0NdzJEpKKbk0kutkS3VcGny8mvfsjz+4Di5XDV0W3i2xmuqM+Z+0gz0XUYvb+Gcu6S+Z3p8Q4Ceydku6HzNb4kw/wAK5+pfMDkVaHqE3s6VBdspI6OHw3FPlZdqn+SvmXtN64kw9+eu5epfM218QafLpsnD0oP4AdGimuitV0wjCC6EjYRadQxL9vBZFcm+rfZ/uSkAAAAAAAAAAAAA52r6nDArW20rpeTH4sCTmZlGHXy8iaiupdb7kV7M4ium2sSCrj96S3l8kcfIvtyLZWXTc5y631GsDbffdkS5V9s7H+ZmswAAAAAAAScbPysVrwN80l9lvdexkYAWTA4ii9oZsOS/xILm9aO9VbC6tWVTU4S6HF7o89JmnahdgWcqp71vyq30P/YF5Bow8qrMojdS94vq60+w3gAAAAAGvIuhRRO2x+LBbsomVkTysiy+x+NN+xdhZuKLXXpyhF/3LEn3dPwRVAMAAAAAAAAAAAAAAAA6egZrxM2MG34K18mS7H1MuSPO9y+YFrvwqLZdM64t9+wEgAAAABweLfo+P6b9xWCz8W/R8f037isAAAAAAAAAAAAAAAAAC8aL9V436aKQXfRfqvG/TQE0AAAABweLfo+P6b9xWAAAAAAAAAAAAAAAAAAMl30X6rxv00ABNAAH/9k="
  },
  onboardingCompleted: { type: Boolean, default: false },
  monthlyBudget: Number,
  incomeSources:[{
    source:String,
    amount:String,
  }],
  PrimarySpendsLimits:[{
    title:String,
    amount:String,
  }],
});
userSchema.methods.matchPassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};
userSchema.pre("save", async function (next) {
  if (!this.isModified("password")){
    return next();
  }

  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});
export const User = mongoose.model('User',userSchema);
