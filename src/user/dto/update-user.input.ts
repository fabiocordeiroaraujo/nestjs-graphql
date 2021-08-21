import { InputType } from "@nestjs/graphql";
import { IsEmail, IsNotEmpty, IsString, IsOptional } from "class-validator";

@InputType()
export class UpdateUserInput {

    @IsString()
    @IsOptional()
    name?: string;

    @IsEmail()
    @IsOptional()
    email?: string;

    constructor(name?: string, email?: string){
        this.name = name;
        this.email = email;
    }
}