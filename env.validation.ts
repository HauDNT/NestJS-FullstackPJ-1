import { plainToInstance } from 'class-transformer';
import { IsEnum, IsNumber, IsString, validateSync } from 'class-validator';

enum Environment {
    Development = 'development',
    Production = 'production',
    Test = 'test',
    Provision = 'provision',
}

class EnvironmentVariables {
    @IsEnum(Environment)
    NODE_ENV: Environment;

    @IsNumber()
    PORT: number;

    @IsString()
    DB_HOST: string;

    @IsString()
    DB_USERNAME: string;

    @IsString()
    DB_PASSWORD: string;

    @IsString()
    SECRET_KEY: string;
}

export function validate(config: Record<string, unknown>) {
    const validatedConfig = plainToInstance(EnvironmentVariables, config, {
        /*
        * enableImplicitConversion will tell class-transformer that if it sees a primitive that is currently a string
        * (like a boolean or a number) to assume it should be the primitive type instead and transform it, even though
        * @Type(() => Number) or @Type(() => Boolean) isn't used.
        */
        enableImplicitConversion: true,
    });

    /**
    * Performs sync validation of the given object.
    * Note that this method copletely ignores async validations.
    * If you want to properly perform validation you need to call validate method instead.
    */

    const errors = validateSync(validatedConfig, {
        skipMissingProperties: false,
    });

    if (errors.length > 0) {
        throw new Error(errors.toString());
    }

    return validatedConfig;
}