import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Upload, Plus, X, DollarSign, Clock, Users } from "lucide-react";
import { useState } from "react";

interface CreateGigFormProps {
  onSubmit: () => void;
  onCancel: () => void;
}

const CreateGig = ({ onSubmit, onCancel }: CreateGigFormProps) => {
  const [gigData, setGigData] = useState({
    title: "",
    description: "",
    category: "",
    tags: [] as string[],
    pricingType: "hourly", // hourly or fixed
    hourlyRate: "",
    fixedPrice: "",
    deliveryTime: "",
    revisions: "3",
    requiresNDA: false
  });

  const [newTag, setNewTag] = useState("");

  const addTag = () => {
    if (newTag.trim() && !gigData.tags.includes(newTag.trim())) {
      setGigData(prev => ({
        ...prev,
        tags: [...prev.tags, newTag.trim()]
      }));
      setNewTag("");
    }
  };

  const removeTag = (tagToRemove: string) => {
    setGigData(prev => ({
      ...prev,
      tags: prev.tags.filter(tag => tag !== tagToRemove)
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Here you would normally send the data to your backend
    console.log("Gig data:", gigData);
    onSubmit();
  };

  return (
    <div className="min-h-screen bg-background py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground mb-4">Create a New Gig</h1>
          <p className="text-muted-foreground">Share your skills with potential clients</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Basic Information */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Users className="w-5 h-5" />
                Basic Information
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <Label htmlFor="title">Gig Title</Label>
                <Input
                  id="title"
                  placeholder="I will create a professional website for your business"
                  value={gigData.title}
                  onChange={(e) => setGigData(prev => ({ ...prev, title: e.target.value }))}
                  className="mt-1"
                  required
                />
                <p className="text-xs text-muted-foreground mt-1">
                  Write a clear title that describes what you'll do for clients
                </p>
              </div>

Alligience, [9/9/2025 1:48 AM]
<div>
                <Label htmlFor="category">Category</Label>
                <Select 
                  value={gigData.category} 
                  onValueChange={(value) => setGigData(prev => ({ ...prev, category: value }))}
                  required
                >
                  <SelectTrigger className="mt-1">
                    <SelectValue placeholder="Select your gig category" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="web-development">Web Development</SelectItem>
                    <SelectItem value="mobile-development">Mobile Development</SelectItem>
                    <SelectItem value="graphic-design">Graphic Design</SelectItem>
                    <SelectItem value="content-writing">Content Writing</SelectItem>
                    <SelectItem value="digital-marketing">Digital Marketing</SelectItem>
                    <SelectItem value="video-editing">Video Editing</SelectItem>
                    <SelectItem value="business-consulting">Business Consulting</SelectItem>
                    <SelectItem value="data-entry">Data Entry</SelectItem>
                    <SelectItem value="translation">Translation</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  placeholder="Describe your service in detail. What will you deliver? What makes you the right person for this job?"
                  value={gigData.description}
                  onChange={(e) => setGigData(prev => ({ ...prev, description: e.target.value }))}
                  className="mt-1 min-h-[120px]"
                  required
                />
              </div>

              <div>
                <Label>Tags</Label>
                <div className="flex gap-2 mt-1">
                  <Input
                    placeholder="Add a tag (e.g., React, WordPress, SEO)"
                    value={newTag}
                    onChange={(e) => setNewTag(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addTag())}
                  />
                  <Button type="button" variant="outline" onClick={addTag}>
                    <Plus className="w-4 h-4" />
                  </Button>
                </div>
                
                {gigData.tags.length > 0 && (
                  <div className="flex flex-wrap gap-2 mt-3">
                    {gigData.tags.map((tag, index) => (
                      <Badge key={index} variant="secondary" className="flex items-center gap-1">
                        {tag}
                        <X 
                          className="w-3 h-3 cursor-pointer hover:text-destructive" 
                          onClick={() => removeTag(tag)}
                        />
                      </Badge>
                    ))}
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Pricing & Delivery */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <DollarSign className="w-5 h-5" />
                Pricing & Delivery
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <Label>Pricing Type</Label>
                <Select 
                  value={gigData.pricingType} 
                  onValueChange={(value) => setGigData(prev => ({ ...prev, pricingType: value }))}
                >
                  <SelectTrigger className="mt-1">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="hourly">Hourly Rate</SelectItem>
                    <SelectItem value="fixed">Fixed Price</SelectItem>
                  </SelectContent>
                </Select>
              </div>

Alligience, [9/9/2025 1:48 AM]
{gigData.pricingType === "hourly" ? (
                <div>
                  <Label htmlFor="hourlyRate">Hourly Rate (USD)</Label>
                  <Input
                    id="hourlyRate"
                    type="number"
                    placeholder="25"
                    value={gigData.hourlyRate}
                    onChange={(e) => setGigData(prev => ({ ...prev, hourlyRate: e.target.value }))}
                    className="mt-1"
                    required
                  />
                </div>
              ) : (
                <div>
                  <Label htmlFor="fixedPrice">Fixed Price (USD)</Label>
                  <Input
                    id="fixedPrice"
                    type="number"
                    placeholder="500"
                    value={gigData.fixedPrice}
                    onChange={(e) => setGigData(prev => ({ ...prev, fixedPrice: e.target.value }))}
                    className="mt-1"
                    required
                  />
                </div>
              )}

              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="deliveryTime">Delivery Time</Label>
                  <Select 
                    value={gigData.deliveryTime} 
                    onValueChange={(value) => setGigData(prev => ({ ...prev, deliveryTime: value }))}
                    required
                  >
                    <SelectTrigger className="mt-1">
                      <SelectValue placeholder="Select delivery time" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="1-day">1 Day</SelectItem>
                      <SelectItem value="3-days">3 Days</SelectItem>
                      <SelectItem value="1-week">1 Week</SelectItem>
                      <SelectItem value="2-weeks">2 Weeks</SelectItem>
                      <SelectItem value="1-month">1 Month</SelectItem>
                      <SelectItem value="2-months">2 Months</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="revisions">Number of Revisions</Label>
                  <Select 
                    value={gigData.revisions} 
                    onValueChange={(value) => setGigData(prev => ({ ...prev, revisions: value }))}
                  >
                    <SelectTrigger className="mt-1">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="1">1 Revision</SelectItem>
                      <SelectItem value="2">2 Revisions</SelectItem>
                      <SelectItem value="3">3 Revisions</SelectItem>
                      <SelectItem value="5">5 Revisions</SelectItem>
                      <SelectItem value="unlimited">Unlimited</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Additional Options */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Clock className="w-5 h-5" />
                Additional Options
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <Label htmlFor="nda">Require NDA</Label>
                  <p className="text-sm text-muted-foreground">
                    Require clients to sign a Non-Disclosure Agreement
                  </p>
                </div>
                <Switch
                  id="nda"
                  checked={gigData.requiresNDA}
                  onCheckedChange={(checked) => setGigData(prev => ({ ...prev, requiresNDA: checked }))}
                />
              </div>

Alligience, [9/9/2025 1:48 AM]
<div>
                <Label>Portfolio Images</Label>
                <div className="mt-2 border-2 border-dashed border-border rounded-lg p-8 text-center">
                  <Upload className="w-8 h-8 text-muted-foreground mx-auto mb-4" />
                  <p className="text-muted-foreground">
                    Upload images showcasing your previous work (optional)
                  </p>
                  <Button type="button" variant="outline" className="mt-4">
                    Choose Files
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Submit Buttons */}
          <div className="flex justify-center gap-4">
            <Button type="button" variant="outline" onClick={onCancel}>
              Cancel
            </Button>
            <Button type="submit" variant="hero" size="lg">
              Publish Gig
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateGig;