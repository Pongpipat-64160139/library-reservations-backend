import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersModule } from './users/users.module';
import { RolesModule } from './roles/roles.module';
import { RoleAssignmentsModule } from './role-assignments/role-assignments.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './users/entities/user.entity';
import { Role } from './roles/entities/role.entity';
import { RoleAssignment } from './role-assignments/entities/role-assignment.entity';
import { FloorsModule } from './floors/floors.module';
import { Floor } from './floors/entities/floor.entity';
import { RoomsModule } from './rooms/rooms.module';
import { Room } from './rooms/entities/room.entity';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'mysql',
      host: 'localhost',
      port: 3306,
      username: 'root',
      database: 'buu_library_booking',
      entities: [User, Role, RoleAssignment, Floor, Room],
      synchronize: true,
    }),
    UsersModule,
    RolesModule,
    RoleAssignmentsModule,
    FloorsModule,
    RoomsModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
