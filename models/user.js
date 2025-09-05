import mongoose from "mongoose";
import bcrypt from 'bcrypt';

const saltRound = 10;

const userSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true,
        minlength: 3,
        maxlength: 30,
        unique: true,
        trim: true,
    },
    email: {
        type: String,
        required: true,
        unique: true,
        trim: true,
        lowercase: true,
    },
    password: {
        type: String,
        required: true,
        trim: true,
    },
    businessName: {
        type: String,
        required: true,
        trim: true,
    },
    businessId: {
        type: mongoose.Schema.Types.ObjectId,
        default: () => new mongoose.Types.ObjectId(),
    },

}, {
    timestamps: true,
},);

// Hashing password before saving to db
userSchema.pre('save', async function (next) {
    try {
        if (!this.isModified("password")) {
            return next();
        }
        this.password = await bcrypt.hash(this.password, saltRound);
        next();
    }
    catch (err) {
        next(err);
    }
})

// Compare password
userSchema.methods.comparePassword = async function (candidatePassword){
    return bcrypt.compare(candidatePassword, this.password);
};

userSchema.methods.toJSON = function () {
    const user = this.toObject();
    delete user.password;
    return user;
};

const User = mongoose.model('User', userSchema);
export default User;