<?php

namespace ItsGoingToBeBundle\Command;

use Doctrine\ORM\EntityManagerInterface;
use Symfony\Component\Console\Command\Command;
use Symfony\Component\Console\Input\InputArgument;
use Symfony\Component\Console\Input\InputInterface;
use Symfony\Component\Console\Output\OutputInterface;
use ItsGoingToBeBundle\Entity\User;

class CreateUserCommand extends Command
{
    /**
     * @var EntityManagerInterface
     */
    protected $em;

    /**
     * @param EntityManagerInterface $entityManager
     */
    public function setEntityManager(EntityManagerInterface $em)
    {
        $this->em = $em;
    }

    /**
     * Configuration for the command
     */
    protected function configure()
    {
        $this
            ->setName('itsgoingtobe:create-user')
            ->setDescription('Creates a new user.')
            ->setHelp('This command allows you to create a user...')
            ->addArgument('username', InputArgument::REQUIRED, 'The username for the user.')
            ->addArgument('password', InputArgument::REQUIRED, 'The password for the user.');
    }

    /**
     * Execute action for the command
     *
     * @param InputInterface $input
     * @param OutputInterface $output
     */
    protected function execute(InputInterface $input, OutputInterface $output)
    {
        $user = new User();
        $user->setUsername($input->getArgument('username'));
        $user->setPlainPassword($input->getArgument('password'));

        $this->em->persist($user);
        $this->em->flush();
    }
}