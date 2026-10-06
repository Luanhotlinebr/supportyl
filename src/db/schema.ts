import { pgTable,pgEnum, varchar ,uuid, timestamp, text} from "drizzle-orm/pg-core";

export const roleType = pgEnum('role_type',['ADMIN','TECNICO']);

export const userTable = pgTable("user",{
  id: uuid('id').defaultRandom().primaryKey(),
  name: varchar('name',{length:255}).notNull(),
  userName: varchar('user_name',{length:30}).notNull().unique(),
  passwordHash: text('password_hash').notNull(),
  phoneNumber: varchar('phone_number',{length:16}),
  role: roleType('role').default('TECNICO').notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull()
})

