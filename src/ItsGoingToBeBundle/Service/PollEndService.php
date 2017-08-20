<?php

namespace ItsGoingToBeBundle\Service;

use Doctrine\ORM\EntityManager;
use ItsGoingToBeBundle\Entity\Poll;

/**
 * ItsGoingToBeBundle\Service\PollEndService
 */
class PollEndService
{
    /**
     * @var EntityManager
     */
    protected $entityManager;

    /**
     * @param EntityManager $entityManager
     */
    public function setEntityManager(EntityManager $entityManager)
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
