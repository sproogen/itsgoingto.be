<?php

namespace ItsGoingToBeBundle\Entity;

use Doctrine\ORM\Mapping as ORM;
use Doctrine\ORM\Event\LifecycleEventArgs;
use Doctrine\Common\Collections\ArrayCollection;
use ItsGoingToBeBundle\Entity\Answer;
use ItsGoingToBeBundle\Entity\UserResponse;

/**
 * Entity to store a question.
 */
class Question
{
    /**
     * The id of this Entity.
     *
     * @var integer
     */
    protected $id;

    /**
     * A unique identifier for this question.
     *
     * @var string
     */
    protected $identifier;

    /**
     * The question text.
     *
     * @var string
     */
    protected $question;

    /**
     * The answers for this question.
     *
     * @var Answer[]
     */
    protected $answers;

    /**
     * The responses for this question.
     *
     * @var Response[]
     */
    protected $responses;

    /**
     * Is the question multiple choice.
     *
     * @var boolean
     */
    protected $multipleChoice;

    /**
     * Has the question been deleted
     *
     * @var boolean
     */
    protected $deleted = false;

    /**
     * When this Entity was created.
     *
     * @var \DateTime
     */
    protected $created;

    /**
     * When this Entity was last updated.
     *
     * @var \DateTime
     */
    protected $updated;

    /**
     * Question constructor
     */
    public function __construct()
    {
        $this->answers = new ArrayCollection();
        $this->responses = new ArrayCollection();
    }

    /**
     * Lifecycle callback method for the 'prePersist' event.
     *
     * Sets the $created and $updated dates to now.
     *
     * @param LifecycleEventArgs $args Args for this Lifecycle event, passed in by Doctrine.
     */
    public function prePersist(LifecycleEventArgs $args)
    {
        $this->setCreated();
        $this->setUpdated();
    }

    /**
     * Lifecycle callback method for the 'preUpdate' event.
     *
     * Sets the $updated date to now.
     *
     * @param LifecycleEventArgs $args Args for this Lifecycle event, passed in by Doctrine.
     */
    public function preUpdate(LifecycleEventArgs $args)
    {
        $this->setUpdated();
    }

    /**
     * Extract the data for the question
     *
     * @return []
     */
    public function extract()
    {
        $data = [
            'id'             => $this->getId(),
            'identifier'     => $this->getIdentifier(),
            'question'       => $this->getQuestion(),
            'multipleChoice' => $this->getMultipleChoice(),
            'deleted'        => $this->getDeleted(),
            'created'        => $this->getCreated(),
            'updated'        => $this->getUpdated()
        ];
        $answers = [];
        foreach ($this->getAnswers() as $answer) {
            $answers[] = [
                'type' => 'answer',
                'id'   => $answer->getId()
            ];
        }
        $data['answers'] = $answers;
        $responses = [];
        foreach ($this->getResponses() as $response) {
            $responses[] = [
                'type' => 'userResponse',
                'id'   => $response->getId()
            ];
        }
        $data['responses'] = $responses;
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
     * Set key
     *
     * @param string $key
     *
     * @return Question
     */
    public function setIdentifier($identifier)
    {
        $this->identifier = $identifier;

        return $this;
    }

    /**
     * Get key
     *
     * @return string
     */
    public function getIdentifier()
    {
        return $this->identifier;
    }

    /**
     * Set question
     *
     * @param string $question
     *
     * @return Question
     */
    public function setQuestion($question)
    {
        $this->question = $question;

        return $this;
    }

    /**
     * Get question
     *
     * @return string
     */
    public function getQuestion()
    {
        return $this->question;
    }

    /**
     * Add answer
     *
     * @param Answer $answer
     *
     * @return Question
     */
    public function addAnswer(Answer $answer)
    {
        $answer->setQuestion($this);
        $this->answers[] = $answer;

        return $this;
    }

    /**
     * Remove answer
     *
     * @param Answer $answer
     */
    public function removeAnswer(Answer $answer)
    {
        $this->answers->removeElement($answer);
    }

    /**
     * Get answers
     *
     * @return \Doctrine\Common\Collections\Collection
     */
    public function getAnswers()
    {
        return $this->answers;
    }

    /**
     * Add response
     *
     * @param UserResponse $response
     *
     * @return Question
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

    /**
     * Set multipleChoice
     *
     * @param boolean $multipleChoice
     *
     * @return Question
     */
    public function setMultipleChoice($multipleChoice)
    {
        $this->multipleChoice = $multipleChoice;

        return $this;
    }

    /**
     * Get multipleChoice
     *
     * @return boolean
     */
    public function getMultipleChoice()
    {
        return $this->multipleChoice;
    }

    /**
     * Set deleted
     *
     * @param boolean $deleted
     *
     * @return Question
     */
    public function setDeleted($deleted)
    {
        $this->deleted = $deleted;

        return $this;
    }

    /**
     * Get deleted
     *
     * @return boolean
     */
    public function getDeleted()
    {
        return $this->deleted;
    }

    /**
     * Get when this Entity was created.
     *
     * @return \DateTime
     */
    public function getCreated()
    {
        return $this->created;
    }

    /**
     * Set when this Entity was created.
     *
     * Sets it to now if no $created value is passed.
     *
     * @param \DateTime $created When this Entity was created.
     *
     * @return Entity
     */
    public function setCreated($created = null)
    {
        if (is_null($created)) {
            $created = new \DateTime();
        }

        $this->created = $created;
        return $this;
    }

    /**
     * Get when this Entity was last updated.
     *
     * @return \DateTime
     */
    public function getUpdated()
    {
        return $this->updated;
    }

    /**
     * Set when this Entity was last updated.
     *
     * Sets it to now if no $updated value is passed.
     *
     * @param \DateTime $updated When this Entity was last updated.
     *
     * @return Entity
     */
    public function setUpdated($updated = null)
    {
        if (is_null($updated)) {
            $updated = new \DateTime();
        }

        $this->updated = $updated;
    }
}
