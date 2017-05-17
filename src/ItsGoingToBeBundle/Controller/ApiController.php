<?php

namespace ItsGoingToBeBundle\Controller;

use Symfony\Bundle\FrameworkBundle\Controller\Controller;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpKernel\Exception\HttpException;
use ItsGoingToBeBundle\Entity\Question;
use ItsGoingToBeBundle\Entity\Answer;
use ItsGoingToBeBundle\Entity\UserResponse;
use ItsGoingToBeBundle\Service\IdentifierService;

class ApiController extends Controller
{
    /**
     * @var IdentifierService
     */
    protected $identifierService;

    /**
     * @param IdentifierService $identifierService
     */
    public function setIdentifierService(IdentifierService $identifierService)
    {
        $this->identifierService = $identifierService;
    }

    /**
     * Uses the HTTP method to decide which action to perform.
     *
     * @param  Request   $request   The request object.
     * @param  int       $id        An ID to retrieve, 0 by default.
     *
     * @return JsonResponse        The API response
     */
    public function questionAction(Request $request, $id)
    {
        switch ($request->getMethod()) {
            case 'GET':
                // If GET is used and a non-zero ID is passed, call the retrieve method.
                if ($id) {
                    // TODO : Retrieve a question
                    $response = new JsonResponse();
                } // Without an ID ($id is 0), call index
                else {
                    // TODO : Index a question
                    $response = new JsonResponse();
                }
                break;
            case 'POST':
                // TODO : Create a new question
                $response = new JsonResponse();
                break;
            case 'DELETE':
                // TODO : Delete a question
                $response = new JsonResponse();
                break;
            case 'OPTIONS':
                $response = new Response();
                break;
            default:
                throw new HttpException('405', 'Method not allowed.');
        }

        return $response;
    }
}
