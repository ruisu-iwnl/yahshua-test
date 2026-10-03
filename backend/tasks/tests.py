from django.urls import reverse
from rest_framework import status
from rest_framework.test import APITestCase

from .models import Task


class TaskApiTests(APITestCase):
    def setUp(self):
        self.task = Task.objects.create(
            title="Write the README",
            description="Keep it clear and short.",
        )

    def test_list_tasks(self):
        response = self.client.get(reverse("task-list"))

        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.data), 1)
        self.assertEqual(response.data[0]["title"], self.task.title)

    def test_create_task(self):
        response = self.client.post(
            reverse("task-list"),
            {"title": "Test the app", "description": "Try each action."},
            format="json",
        )

        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertFalse(response.data["completed"])
        self.assertTrue(Task.objects.filter(title="Test the app").exists())

    def test_retrieve_task(self):
        response = self.client.get(reverse("task-detail", args=[self.task.id]))

        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data["id"], self.task.id)

    def test_update_task_title_and_description(self):
        response = self.client.put(
            reverse("task-detail", args=[self.task.id]),
            {"title": "Updated title", "description": "Updated description"},
            format="json",
        )

        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.task.refresh_from_db()
        self.assertEqual(self.task.title, "Updated title")
        self.assertEqual(self.task.description, "Updated description")

    def test_patch_toggles_completed_status(self):
        url = reverse("task-detail", args=[self.task.id])

        first_response = self.client.patch(url, {}, format="json")
        second_response = self.client.patch(url, {}, format="json")

        self.assertEqual(first_response.status_code, status.HTTP_200_OK)
        self.assertTrue(first_response.data["completed"])
        self.assertFalse(second_response.data["completed"])

    def test_delete_task(self):
        response = self.client.delete(
            reverse("task-detail", args=[self.task.id])
        )

        self.assertEqual(response.status_code, status.HTTP_204_NO_CONTENT)
        self.assertFalse(Task.objects.filter(id=self.task.id).exists())

