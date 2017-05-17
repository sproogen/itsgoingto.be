<?php

namespace ItsGoingToBeBundle\Tests\Controller;

use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpKernel\Exception\HttpException;
use ItsGoingToBeBundle\Tests\AbstractTests\BaseTest;

/**
 * Tests for ItsGoingToBeBundle\Controller\ApiController
 */
class ApiControllerTest extends BaseTest
{
    /**
     * An instance of the controller being tested.
     *
     * @var ApiController
     */
    protected $controller;

    /**
     * Method called before each test is run.
     *
     * @throws \Exception if $this->controllerClass is not set.
     * @throws \Exception if $this->ControllerClass is not the name of a class implementing the RestController
     *   interface.
     */
    public function setUp()
    {
        parent::setUp();

        $this->controller = $this->container->get('itsgoingtobe.api_controller');
        $this->client = static::$kernel->getContainer()->get('test.client');
    }

    public function tearDown()
    {
        unset($this->client);

        parent::tearDown();
    }

    /**
     * Test that if a GET request is made, a JsonResponse is returned.
     */
    public function testIndexRequestReturnsJson()
    {
        $this->client->request('GET', 'api/questions');

        $result = $this->controller->questionAction($this->client->getRequest(), 0);

        self::assertInstanceOf(JsonResponse::class, $result);
    }

    /**
     * Test that if a GET request is made with and identifier, a JsonResponse is returned.
     */
    public function testRetrieveRequestReturnsJson()
    {
        $this->client->request('GET', 'api/questions/gf56dg');

        $result = $this->controller->questionAction($this->client->getRequest(), 'gf56dg');

        self::assertInstanceOf(JsonResponse::class, $result);
    }

    /**
     * Test that if a POST request is made, a JsonResponse is returned.
     */
    public function testPostRequestReturnsJson()
    {
        $this->client->request('POST', 'api/questions/');

        $result = $this->controller->questionAction($this->client->getRequest(), 0);

        self::assertInstanceOf(JsonResponse::class, $result);
    }

    /**
     * Test that if a DELETE request is made with an identifier, a JsonResponse is returned.
     */
    public function testDeleteRequestReturnsJson()
    {
        $this->client->request('DELETE', 'api/questions/gf56dg');

        $result = $this->controller->questionAction($this->client->getRequest(), 'gf56dg');

        self::assertInstanceOf(JsonResponse::class, $result);
    }

    /**
     * Test that if an OPTIONS request is made, a Response is returned.
     */
    public function testOptionsRequestReturnsResponse()
    {
        $this->client->request('OPTIONS', 'api/questions/');

        $result = $this->controller->questionAction($this->client->getRequest(), 0);

        $this->assertEquals(
            new Response(),
            $result
        );
    }

    /**
     * Test that if a request with an unsupported method is made, a HTTP Exception is thrown.
     */
    public function testHeadRequestReturnsHttpException()
    {
        $this->client->request('HEAD', 'api/questions/');

        $this->expectException(HttpException::class);
        $this->expectExceptionMessage('Method not allowed.');

        $this->controller->questionAction($this->client->getRequest(), 0);
    }
}
