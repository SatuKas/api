-- CreateIndex
CREATE INDEX "account_book_id_code_idx" ON "account"("book_id", "code");

-- CreateIndex
CREATE INDEX "account_parent_id_idx" ON "account"("parent_id");

-- CreateIndex
CREATE INDEX "account_type_idx" ON "account"("type");

-- CreateIndex
CREATE INDEX "book_member_book_id_user_id_idx" ON "book_member"("book_id", "user_id");

-- CreateIndex
CREATE INDEX "book_member_user_id_status_idx" ON "book_member"("user_id", "status");

-- CreateIndex
CREATE INDEX "journal_book_id_date_idx" ON "journal"("book_id", "date");

-- CreateIndex
CREATE INDEX "journal_ref_type_ref_id_idx" ON "journal"("ref_type", "ref_id");

-- CreateIndex
CREATE INDEX "journal_entry_journal_id_account_id_idx" ON "journal_entry"("journal_id", "account_id");

-- CreateIndex
CREATE INDEX "journal_entry_account_id_created_at_idx" ON "journal_entry"("account_id", "created_at");
