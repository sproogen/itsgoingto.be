<?php

namespace ItsGoingToBeBundle\Entity;

use Doctrine\ORM\Mapping as ORM;
use Doctrine\Common\Collections\ArrayCollection;
use ItsGoingToBeBundle\Entity\Question;
use ItsGoingToBeBundle\Entity\UserResponse;

/**
 * Entity to store an answer for a question.
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
     * @var  string
     */
    protected $answer;

    /**
     * The question for this answer.
     *
     * @var  Question
     */
    protected $question;

    /**
     * The responses for this answer
     *
     * @var  UserResponse[]
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
     * Get id
     *
     * @return integer
     */
    public function getId()
    {
        return $this->id;
    }

    /**
     * Set question
     *
     * @param Question $question
     *
     * @return Answer
     */
    public function setQuestion(Question $question = null)
    {
        $this->question = $question;

        return $this;
    }

    /**
     * Get question
     *
     * @return Question
     */
    public function getQuestion()
    {
        return $this->question;
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
