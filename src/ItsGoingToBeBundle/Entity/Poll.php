<?php

namespace ItsGoingToBeBundle\Entity;

use Doctrine\ORM\Mapping as ORM;
use Doctrine\Common\Collections\ArrayCollection;
use ItsGoingToBeBundle\Entity\Answer;
use ItsGoingToBeBundle\Entity\UserResponse;

/**
 * Entity to store a poll.
 */
class Poll
{
    /**
     * The id of this Entity.
     *
     * @var integer
     */
    protected $id;

    /**
     * A unique identifier for this poll.
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
     * The answers for this poll.
     *
     * @var Answer[]
     */
    protected $answers;

    /**
     * The responses for this poll.
     *
     * @var Response[]
     */
    protected $responses;

    /**
     * Is the poll multiple choice.
     *
     * @var boolean
     */
    protected $multipleChoice;

    /**
     * A passphrase for the poll.
     *
     * @var string
     */
    protected $passphrase;

    /**
     * Has the poll been deleted
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
     * Poll constructor
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
     */
    public function prePersist()
    {
        $this->setCreated();
        $this->setUpdated();
    }

    /**
     * Lifecycle callback method for the 'preUpdate' event.
     *
     * Sets the $updated date to now.
     */
    public function preUpdate()
    {
        $this->setUpdated();
    }

    /**
     * Extract the data for the poll
     *
     * @return []
     */
    public function extract()
    {
        $data = [
            'id'             => $this->getId(),
            'identifier'     => $this->getIdentifier(),
            'question'       => $this->getQuestion(),
            'multipleChoice' => $this->isMultipleChoice(),
            'passphrase'     => $this->getPassphrase(),
            'deleted'        => $this->isDeleted(),
            'created'        => $this->getCreated(),
            'updated'        => $this->getUpdated()
        ];
        $answers = [];
        foreach ($this->getAnswers() as $answer) {
            $answers[] = [
                'type' => 'Answer',
                'id'   => $answer->getId()
            ];
        }
        $data['answers'] = $answers;
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
     * Set identifier
     *
     * @param string $identifier
     *
     * @return Poll
     */
    public function setIdentifier($identifier)
    {
        $this->identifier = $identifier;

        return $this;
    }

    /**
     * Get identifier
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
     * @return Poll
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
     * @return Poll
     */
    public function addAnswer(Answer $answer)
    {
        $answer->setPoll($this);
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
     * @return Poll
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
     * @return Poll
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
    public function isMultipleChoice()
    {
        return $this->multipleChoice;
    }

    /**
     * Set passphrase
     *
     * @param boolean $passphrase
     *
     * @return Poll
     */
    public function setPassphrase($passphrase)
    {
        $this->passphrase = $passphrase;

        return $this;
    }

    /**
     * Get passphrase
     *
     * @return boolean
     */
    public function getPassphrase()
    {
        return $this->passphrase;
    }

    /**
     * Has passphrase
     *
     * @return boolean
     */
    public function hasPassphrase()
    {
        return trim($this->getPassphrase()) !== '';
    }

    /**
     * Set deleted
     *
     * @param boolean $deleted
     *
     * @return Poll
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
    public function isDeleted()
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
     * @return Poll
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
     * @return Poll
     */
    public function setUpdated($updated = null)
    {
        if (is_null($updated)) {
            $updated = new \DateTime();
        }

        $this->updated = $updated;
    }
}
