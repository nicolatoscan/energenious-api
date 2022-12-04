import { BadRequestException } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import Joi from 'joi';

export class APIService {
    validateSchema(schema: Joi.ObjectSchema, o: any, throwError = false): string | null {
        const res = schema.validate(o);
        const errors = res?.error?.details?.map(e => e.message).join(', ') ?? null;
        if (throwError && errors) {
            throw new BadRequestException(errors);
        }
        return errors;
    }

    async prismaHandler(fn: () => any) {
        try {
            return await fn();
        } catch (e) {
            //TODO: remove this log
            console.log(e);
            
            if (e instanceof Prisma.PrismaClientKnownRequestError) {
                switch (e.code) {
                    case 'P2000': throw new BadRequestException('The provided value for the column is too long for the column\'s type');
                    case 'P2002': throw new BadRequestException('Unique key violation');
                    case 'P2003': throw new BadRequestException('Foreign key constraint failed on the field');
                    case 'P2004': throw new BadRequestException('A constraint failed on the database');
                    case 'P2005': throw new BadRequestException('Value invalid for datatype');
                    case 'P2006': throw new BadRequestException('Value not valid');
                    case 'P2007': throw new BadRequestException('Data validation error');
                    case 'P2008': throw new BadRequestException('Failed to parse the query');
                    case 'P2009': throw new BadRequestException('Failed to validate the query');
                    case 'P2010': throw new BadRequestException('Raw query failed');
                    case 'P2011': throw new BadRequestException('Null constraint violation');
                    default: throw new BadRequestException(`Unknown database error: ${e.code}`);
                }
            }
            throw new BadRequestException('Unknown database error');
        }
    }
}
