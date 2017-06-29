<?php

namespace Application\Migrations;

use Doctrine\DBAL\Migrations\AbstractMigration;
use Doctrine\DBAL\Schema\Schema;

/**
 * Auto-generated Migration: Please modify to your needs!
 */
class Version20170626181829 extends AbstractMigration
{
    /**
     * @param Schema $schema
     */
    public function up(Schema $schema)
    {
        // this up() migration is auto-generated, please modify it to your needs
        $this->abortIf($this->connection->getDatabasePlatform()->getName() !== 'mysql', 'Migration can only be executed safely on \'mysql\'.');

        $this->addSql('ALTER TABLE answer DROP FOREIGN KEY FK_DADD4A251E27F6BF');
        $this->addSql('ALTER TABLE response DROP FOREIGN KEY FK_3E7B0BFB1E27F6BF');
        $this->addSql('RENAME TABLE question TO poll');
        $this->addSql('DROP INDEX IDX_DADD4A251E27F6BF ON answer');
        $this->addSql('ALTER TABLE answer CHANGE question_id poll_id INT DEFAULT NULL');
        $this->addSql('ALTER TABLE answer ADD CONSTRAINT FK_DADD4A253C947C0F FOREIGN KEY (poll_id) REFERENCES poll (id)');
        $this->addSql('CREATE INDEX IDX_DADD4A253C947C0F ON answer (poll_id)');
        $this->addSql('DROP INDEX IDX_3E7B0BFB1E27F6BF ON response');
        $this->addSql('ALTER TABLE response CHANGE question_id poll_id INT DEFAULT NULL');
        $this->addSql('ALTER TABLE response ADD CONSTRAINT FK_3E7B0BFB3C947C0F FOREIGN KEY (poll_id) REFERENCES poll (id)');
        $this->addSql('CREATE INDEX IDX_3E7B0BFB3C947C0F ON response (poll_id)');
    }

    /**
     * @param Schema $schema
     */
    public function down(Schema $schema)
    {
        // this down() migration is auto-generated, please modify it to your needs
        $this->abortIf($this->connection->getDatabasePlatform()->getName() !== 'mysql', 'Migration can only be executed safely on \'mysql\'.');

        $this->addSql('ALTER TABLE answer DROP FOREIGN KEY FK_DADD4A253C947C0F');
        $this->addSql('ALTER TABLE response DROP FOREIGN KEY FK_3E7B0BFB3C947C0F');
        $this->addSql('RENAME TABLE poll TO question');
        $this->addSql('DROP INDEX IDX_DADD4A253C947C0F ON answer');
        $this->addSql('ALTER TABLE answer CHANGE poll_id question_id INT DEFAULT NULL');
        $this->addSql('ALTER TABLE answer ADD CONSTRAINT FK_DADD4A251E27F6BF FOREIGN KEY (question_id) REFERENCES question (id)');
        $this->addSql('CREATE INDEX IDX_DADD4A251E27F6BF ON answer (question_id)');
        $this->addSql('DROP INDEX IDX_3E7B0BFB3C947C0F ON response');
        $this->addSql('ALTER TABLE response CHANGE poll_id question_id INT DEFAULT NULL');
        $this->addSql('ALTER TABLE response ADD CONSTRAINT FK_3E7B0BFB1E27F6BF FOREIGN KEY (question_id) REFERENCES question (id)');
        $this->addSql('CREATE INDEX IDX_3E7B0BFB1E27F6BF ON response (question_id)');
    }
}
