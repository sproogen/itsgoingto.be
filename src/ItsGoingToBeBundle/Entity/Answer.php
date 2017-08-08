<?php

namespace ItsGoingToBeBundle\Entity;

use Doctrine\ORM\Mapping as ORM;
use Doctrine\Common\Collections\ArrayCollection;
use ItsGoingToBeBundle\Entity\Poll;
use ItsGoingToBeBundle\Entity\UserResponse;

/**
 * Entity to store an answer for a poll.
 */
class Answer
{
    /**
     * The id of this Entity.
     *
     * @var integer
     */
    protected $id;

    /**
     * The answer text.
     *
     * @var string
     */
    protected $answer;

    /**
     * The poll for this answer.
     *
     * @var Poll
     */
    protected $poll;

    /**
     * The responses for this answer
     *
     * @var UserResponse[]
     */
    protected $responses;

    /**
     * Answer constructor
     */
    public function __construct()
    {
        $this->responses = new ArrayCollection();
    }

    /**
     * Extract the data for the answer
     *
     * @return []
     */
    public function extract()
    {
        $data = [
            'id'     => $this->getId(),
            'answer' => $this->getAnswer(),
        ];
        $data['poll'] = [
            'type' => 'Poll',
            'id'   => $this->getPoll()->getId()
        ];
        $data['responsesCount'] = count($this->getResponses());
        return $data;
    }

    /**
     * Get id
     *
     * @return integer
     */
    public function getId()
    {
        return $this->id;
    }

    /**
     * Set poll
     *
     * @param Poll $poll
     *
     * @return Answer
     */
    public function setPoll(Poll $poll)
    {
        $this->poll = $poll;

        return $this;
    }

    /**
     * Get poll
     *
     * @return Poll
     */
    public function getPoll()
    {
        return $this->poll;
    }

    /**
     * Set answer
     *
     * @param string $answer
     *
     * @return Answer
     */
    public function setAnswer($answer)
    {
        $this->answer = $answer;

        return $this;
    }

    /**
     * Get answer
     *
     * @return string
     */
    public function getAnswer()
    {
        return $this->answer;
    }

    /**
     * Add response
     *
     * @param UserResponse $response
     *
     * @return Answer
     */
    public function addResponse(UserResponse $response)
    {
        $this->responses[] = $response;

        return $this;
    }

    /**
     * Remove response
     *
     * @param UserResponse $response
     */
    public function removeResponse(UserResponse $response)
    {
        $this->responses->removeElement($response);
    }

    /**
     * Get responses
     *
     * @return \Doctrine\Common\Collections\Collection
     */
    public function getResponses()
    {
        return $this->responses;
    }
}
