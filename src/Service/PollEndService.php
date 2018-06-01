<?php

namespace App\Service;

use Doctrine\ORM\EntityManagerInterface;
use App\Entity\Poll;

/**
 * App\Service\PollEndService
 */
class PollEndService
{
    /**
     * @var EntityManager
     */
    protected $entityManager;

    /**
     * @param EntityManagerInterface $entityManager
     */
    public function __construct(EntityManagerInterface $entityManager)
    {
        $this->entityManager = $entityManager;
    }

    /**
     * Update the end date of a poll if it has ended
     *
     * @param  Poll $poll
     *
     * @return Poll
     */
    public function updateIfEnded(Poll $poll)
    {
        if (!$poll->isEnded() && $poll->shouldHaveEnded()) {
            $poll->setEnded(true);
            $this->entityManager->persist($poll);
            $this->entityManager->flush();
        }

        return $poll;
    }
}
