import { Injectable, ExecutionContext, UnauthorizedException, Logger } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { Observable } from 'rxjs';

@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {
  private readonly logger = new Logger(JwtAuthGuard.name);

  canActivate(context: ExecutionContext): boolean | Promise<boolean> | Observable<boolean> {
    // Extract the token from the request for debugging
    const request = context.switchToHttp().getRequest();
    const token = request.headers.authorization;

    return super.canActivate(context);
  }

  handleRequest(err: any, user: any, info: any) {
    if (err) {
      this.logger.error('JWT validation error', {
        error: err.message,
        stack: err.stack,
        info: info?.message
      });
      throw err;
    }

    if (!user) {
      this.logger.error('JWT validation failed - no user returned', {
        info: info?.message || 'No error info available'
      });
      throw new UnauthorizedException('Authentication required');
    }


    return user;
  }
}
