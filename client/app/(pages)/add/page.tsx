"use client";
import React, { useState } from 'react';
import { Search, Upload, User } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { useUser } from '@/hooks/useUser';
import { useToast } from '@/hooks/use-toast';
import { useColorMutation } from '@/hooks/useColorMutation';

const Page = () => {
  const [colors, setColors] = useState(['#CCCCCC', '#BBBBBB', '#AAAAAA', '#999999']);
  const [tags, setTags] = useState('');
  const [username, setUsername] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const userToken = useUser();
  const { toast } = useToast();
  const { addColorMutation } = useColorMutation();

  const handleColorChange = (index: number, value: string) => {
    const newColors = [...colors];
    newColors[index] = value.toUpperCase();
    setColors(newColors);
  };

  const handleSubmit = async () => {
    if (!userToken) {
      toast({
        title: "Error",
        description: "You need to be logged in to submit a palette",
        variant: "destructive"
      });
      return;
    }

    try {
      await addColorMutation.mutateAsync({
        username: username,
        colorHex: colors
      })
      toast({
        title: "Success!",
        description: "Color palette has been added to the collection"
      });

      // Reset form
      setColors(['#CCCCCC', '#BBBBBB', '#AAAAAA', '#999999']);
      setTags('');
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to submit color palette. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-4 max-w-md mx-auto space-y-6">
      <div className="text-center space-y-2">
        <h1 className="text-2xl font-semibold">New Color Palette</h1>
        <p className="text-gray-600">
          Create a new palette and contribute to Color Hunt's collection
        </p>
      </div>

      <Card className="w-full aspect-square overflow-hidden rounded-2xl">
        <div className="h-full flex flex-col">
          {colors.map((color, index) => (
            <div
              key={index}
              className="flex-1 relative group"
              style={{ backgroundColor: color }}
            >
              <div className="absolute inset-0 flex items-center justify-center">
                <input
                  type="color"
                  value={color}
                  onChange={(e) => handleColorChange(index, e.target.value)}
                  className="opacity-0 absolute inset-0 w-full h-full cursor-pointer"
                />
                {/* <input
                  type="text"
                  value={color}
                  onChange={(e) => {
                    const value = e.target.value;
                    const hexRegex = /^#?([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/;
                    if (value.startsWith('#') && !hexRegex.test(value)) return;
                    if (!value.startsWith('#') && !hexRegex.test('#' + value)) return;
                    handleColorChange(index, value.startsWith('#') ? value : '#' + value);
                  }}
                  className="absolute z-10 bg-black/50 text-white text-center py-1 px-2 rounded w-24 group-hover:opacity-100 group-focus-within:opacity-100 opacity-100 transition-opacity"
                /> */}
                {/* <span className="text-white font-mono opacity-0 group-hover:opacity-100 pointer-events-none">
                  {color}
                </span> */}
              </div>
            </div>
          ))}
        </div>
      </Card>

      <div className="w-full space-y-4">
        {/* <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
          <Input
            type="text"
            placeholder="Add tags (comma-separated)"
            value={tags}
            onChange={(e) => setTags(e.target.value)}
            className="w-full pl-10 rounded-full"
          />
        </div> */}

        <div className='relative'>
          <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
          <Input type="text"
            placeholder="username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            className="w-full pl-10 rounded-full" />
        </div>

        <Button
          onClick={handleSubmit}
          className="w-full"
          disabled={isSubmitting}
        >
          <Upload />
          {isSubmitting ? "Submitting..." : "Submit Palette"}
        </Button>
      </div>
    </div>
  );
};

export default Page;