import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Role } from './role.enum';
import { ROLES_KEY } from './roles.decorator';



@Injectable()
export class RolesGuard implements CanActivate {
    constructor(private reflector: Reflector) { }

    canActivate(context: ExecutionContext): boolean {
        const requiredRoles = this.reflector.getAllAndOverride<Role[]>(ROLES_KEY, [
            context.getHandler(),
            context.getClass(),
        ]);
        if (!requiredRoles || requiredRoles.length <= 0) {
            return true;
        }
        const { user } = context.switchToHttp().getRequest();
        // const res = user?.role && requiredRoles.some((role) => user.role >= role);
        if (requiredRoles.some((r) => r == Role.Admin)) {
            return user?.admin;
        }
        return true;
    }
}
