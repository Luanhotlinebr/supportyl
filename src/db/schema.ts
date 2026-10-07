import { pgTable,pgEnum, varchar ,uuid, timestamp, text, date} from "drizzle-orm/pg-core";

 const roleType = pgEnum('role_type',['ADMIN','TECNICO']);
 const documentType = pgEnum('document_type',['CPF','CNPJ']);
 const statusTicketType = pgEnum("status_ticket",['ABERTO','ANDAMENTO','CONCLUIDO']);
 const priorityType = pgEnum('priority_type',['BAIXA','NORMAL','ALTA','URGENTE']);

 const userTable = pgTable("users",{
  id: uuid('id').defaultRandom().primaryKey(),
  name: varchar('name',{length:255}).notNull(),
  userName: varchar('user_name',{length:30}).notNull().unique(),
  passwordHash: text('password_hash').notNull(),
  phoneNumber: varchar('phone_number',{length:16}),
  role: roleType('role').default('TECNICO').notNull(),
  createdAt: timestamp('created_at',{ withTimezone: true }).defaultNow().notNull()
})

 const customerTable = pgTable("customers",{
  id: uuid('id').defaultRandom().primaryKey(),
  name: varchar('name',{length:255}).notNull(),
  documentType: documentType('document_type').default('CPF').notNull(),
  document: varchar('document',{length:18}).notNull().unique(),
  description: text('description'),
  createdAt: timestamp('created_at',{ withTimezone: true }).defaultNow().notNull(),
  phone: varchar('phone_number',{length:16}),
  birthDate: date('birth_date',{mode:"string"})
})

const ticketTable = pgTable("tickets",{
  id:uuid('id').defaultRandom().primaryKey(),
  title: varchar('title',{length:128}).notNull(),
  description:text('description').notNull(),
  status: statusTicketType('status').default('ABERTO').notNull(),
  priority: priorityType('priority').default('NORMAL').notNull(),

  createdBy: uuid('created_by').references(()=> userTable.id,{onDelete:"restrict"}).notNull(),
  assignedTo: uuid('assigned_to').references(()=>userTable.id, {onDelete:'restrict'}).notNull(),
  customer: uuid('customer_id').references(()=>customerTable.id,{onDelete:"restrict"}).notNull(),
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
  updatedAt: timestamp('updated_at', { withTimezone: true })
    .defaultNow()
    .$onUpdate(() => new Date())
    .notNull(),
})

const commentTable = pgTable('comments',{
  id:uuid('id').defaultRandom().primaryKey(),
  content: text('content').notNull(),
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),

  author: uuid('author_id').references(()=> userTable.id,{onDelete:"restrict"}).notNull(),
  ticket: uuid('ticket_id').references(()=> ticketTable.id,{onDelete:"restrict"}).notNull()
})

const ticketHistory = pgTable('ticket_histories', {
  id: uuid('id').defaultRandom().primaryKey(),
  action: varchar('action', { length: 50 }).notNull(),
  previousValue: text('previous_value'),
  newValue: text('new_value'),
  createdAt: timestamp('created_at', { withTimezone: true })
    .defaultNow()
    .notNull(),
  userId: uuid('user_id')
    .references(() => userTable.id, { onDelete: 'restrict' })
    .notNull(),
  ticketId: uuid('ticket_id')
    .references(() => ticketTable.id, { onDelete: 'restrict' })
    .notNull(),
});

export {
  roleType,
  documentType,
  statusTicketType,
  priorityType,
  userTable,
  customerTable,
  ticketTable,
  commentTable,
  ticketHistory
}