-- AlterTable: add bank_code to donation_accounts
ALTER TABLE `donation_accounts` ADD COLUMN `bank_code` VARCHAR(20) NULL;
